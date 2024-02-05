---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


# 기존 java mail 로 보내기
https://java.net/projects/javamail/pages/Home
``` java
<dependency>
	<groupId>com.sun.mail</groupId>
	<artifactId>javax.mail</artifactId>
	<version>1.5.4</version>
</dependency>
```
java mail 을 추가합니다.
``` java
public static void smtp
(
	String host, String port, String user, String password,
	String senderMail, String readerMail,
	String subject, String content
) throws AddressException, MessagingException
{
	Properties props = new Properties();

	// smtp에 필요한 인증부
	props.put("mail.smtp.starttls.enable", "true");
	props.put("mail.smtp.ssl.trust", host);
	props.put("mail.smtp.auth", "true");

	// 호스트 / 포트
	props.put("mail.smtp.host", host);
	if (port != null)
	{
		props.put("mail.smtp.port", port);
		props.put("mail.smtp.socketFactory.port", port);
		props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
	}

	// 인증을 포함한 메시지 만들기
	Message msg = new MimeMessage(Session.getInstance(props, new Authenticator()
	{
		public PasswordAuthentication getPasswordAuthentication()
		{
			return new PasswordAuthentication(user, password);
		}
	}));

	msg.setFrom(new InternetAddress(senderMail));
	msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(readerMail));
	msg.setSubject(subject);
	msg.setContent(content, "text/html;charset=UTF-8");
	msg.setSentDate(new Date());
	Transport.send(msg);
}
```


# Spring boot 로 email 보내기
http://docs.spring.io/spring/docs/current/spring-framework-reference/htmlsingle/#mail
- 이유는 모르겠지만 스프링 내에서도 mailSender / JavaMailSender로 갈립니다.
- JavaMailSender 의 경우는 javax.mail 이 있어야합니다.
``` java
<!-- java mail 추가 -->
<dependency>
	<groupId>com.sun.mail</groupId>
	<artifactId>javax.mail</artifactId>
</dependency>
```
설정파일 : 필자는 모든 연결정보를 connection.properties 에 따로 보관합니다.
- 따라서 connection.properties 를 직접 만들어 사용하고 있다는 기준으로 설명.
``` java
# Mail SMTP
saro.mail.smtp.host: smtp 주소
saro.mail.smtp.port: 포트
saro.mail.smtp.user: 유저
saro.mail.smtp.pass: 암호
saro.mail.smtp.mail: 보내는사람 (인증 후 아무 이메일이나 보낼수있다면 이부분을 뺄 수 있겠죠)
```
설정 파일을 만들어봅니다.
``` java
@Configuration
// 필자가 connection.properties 에 설정한 것을 예제로...
@PropertySource("classpath:connection.properties")
public class MailConfig
{
	@Value("${saro.mail.smtp.host}")
	String host;

	@Value("${saro.mail.smtp.port}")
	String port;

	@Value("${saro.mail.smtp.user}")
	String user;

	@Value("${saro.mail.smtp.pass}")
	String pass;

	@Bean
	public JavaMailSender getMailSender()
	{
		JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
		mailSender.setUsername(user);
		mailSender.setPassword(pass);
		mailSender.setJavaMailProperties(getMailProperties());
		return mailSender;
	}

	private Properties getMailProperties()
	{
		Properties properties = new Properties();
		properties.setProperty("mail.transport.protocol", "smtp");
		properties.setProperty("mail.smtp.starttls.enable", "true");
		properties.setProperty("mail.smtp.ssl.trust", host);
		properties.setProperty("mail.smtp.host", host);
		properties.setProperty("mail.smtp.auth", "true");
		properties.setProperty("mail.smtp.port", port);
		properties.setProperty("mail.smtp.socketFactory.port", port);
		properties.setProperty("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
		return properties;
	}
}
```
서비스를 만들어 봅시다.
``` java
@Component
@PropertySource("classpath:connection.properties")
public class MailService
{
	Logger logger = LoggerFactory.getLogger(MailService.class);

	@Autowired
	JavaMailSender javaMailSender;

	@Value("${saro.mail.smtp.mail}")
	String form;

	public boolean sendMail(String to, String subject, String content)
	{
		MimeMessagePreparator preparator = new MimeMessagePreparator()
		{
			public void prepare(MimeMessage mimeMessage) throws Exception
			{
				mimeMessage.setRecipient(Message.RecipientType.TO, new InternetAddress(to));
				mimeMessage.setFrom(new InternetAddress(form));
				mimeMessage.setSubject(subject);
				mimeMessage.setText(content, "utf-8", "html");
			}
		};

		try
		{
			javaMailSender.send(preparator);
			return true;
		}
		catch (MailException me)
		{
			logger.error("MailException", me);
			return false;
		}
	}
}
```
컨트롤러에서 보내기 예제입니다.
``` java
@Autowired
MailService mailService;

@RequestMapping(path="/test-mail-send")
@ResponseBody
String testMailSend()
{
	boolean isSend =
	mailService.sendMail("받는이메일주소", "제목", "메일 내용이다. !!");

	if (isSend)
	{
		return "메일이 발송되었다!!";
	}
	else
	{
		return "메일 보내기 실패 : 로그 확인 바람.!!";
	}
}
```
그리고 실행하면 : 짜잔!! 메일이 보내집니다.